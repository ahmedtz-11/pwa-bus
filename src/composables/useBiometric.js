// Thin wrapper around WebAuthn (passkeys). The browser shows the phone's own
// fingerprint / Face ID prompt. The page never sees the fingerprint itself.

const enc = new TextEncoder();

const toB64u = (buf) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromB64u = (s) => {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

// True only on HTTPS (or localhost) with a fingerprint / face / screen-lock sensor
export async function isBiometricSupported() {
  try {
    return (
      window.isSecureContext &&
      !!window.PublicKeyCredential &&
      (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())
    );
  } catch {
    return false;
  }
}

// Turn on biometric login: the device creates a key pair protected by the fingerprint
export async function registerBiometric({ challenge, user }) {
  const cred = await navigator.credentials.create({
    publicKey: {
      challenge: fromB64u(challenge),
      rp: { name: "ZanBus" }, // id defaults to the current domain
      user: {
        id: enc.encode(user.id),
        name: user.name,
        displayName: user.displayName,
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 }, // ES256
        { type: "public-key", alg: -257 }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform", // built-in sensor, not a USB key
        userVerification: "required", // fingerprint / face / PIN is mandatory
        residentKey: "preferred",
      },
      attestation: "none",
      timeout: 60000,
    },
  });

  return {
    credentialId: cred.id,
    publicKey: cred.response.getPublicKey
      ? toB64u(cred.response.getPublicKey())
      : null,
    clientDataJSON: toB64u(cred.response.clientDataJSON),
  };
}

// Sign in: the phone asks for the fingerprint and signs the server's challenge
export async function authenticateBiometric({ challenge, credentialId }) {
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: fromB64u(challenge),
      allowCredentials: [
        {
          type: "public-key",
          id: fromB64u(credentialId),
          transports: ["internal"],
        },
      ],
      userVerification: "required",
      timeout: 60000,
    },
  });

  return {
    credentialId: assertion.id,
    clientDataJSON: toB64u(assertion.response.clientDataJSON),
    authenticatorData: toB64u(assertion.response.authenticatorData),
    signature: toB64u(assertion.response.signature),
  };
}

// "cancelled" | "unsupported" | "exists" | "failed"
export function biometricErrorCode(e) {
  switch (e?.name) {
    case "NotAllowedError": // user cancelled, timed out, or sensor denied
    case "AbortError":
      return "cancelled";
    case "NotSupportedError":
    case "SecurityError":
      return "unsupported";
    case "InvalidStateError":
      return "exists";
    default:
      return e?.code || "failed";
  }
}
