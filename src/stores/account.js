// Demo store (localStorage). Replace the bodies of these functions with calls
// to your real backend / card-processing API.
import { reactive, computed } from 'vue'

const KEY = 'busgo_account'
const SESSION = 'busgo_session'
const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } }
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const state = reactive({ acct: read(KEY), session: !!read(SESSION) })

const rnd16 = () => Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('')
const persist = () => write(KEY, state.acct)
const log = (label, amt = 0) => {
  state.acct.tx.unshift({ id: Date.now(), label, amt, date: new Date().toLocaleString() })
  persist()
}

export function useAccount() {
  const user = computed(() => (state.session ? state.acct : null))
  const hasAccount = computed(() => !!state.acct)

  function signUp({ name, phone, pass, card }) {
    if (card !== undefined && !/^\d{16}$/.test(card)) throw new Error('Card number must be 16 digits.')
    if (name.trim().length < 2 || phone.length < 7) throw new Error('Enter your name and a valid phone number.')
    if (pass.length < 6) throw new Error('Password must be at least 6 characters.')
    state.acct = {
      name: name.trim(), phone, pass,
      cardNo: card ?? rnd16(), physical: card !== undefined,
      status: 'active', balance: 0, tx: []
    }
    log(card !== undefined ? 'Physical card linked' : 'Virtual card issued')
    state.session = true; write(SESSION, true)
  }

  function signIn(phone, pass) {
    if (!state.acct || state.acct.phone !== phone || state.acct.pass !== pass)
      throw new Error('Wrong phone number or password.')
    state.session = true; write(SESSION, true)
  }

  function signOut() { state.session = false; write(SESSION, false) }

  function topUp(amount, method) {
    return new Promise((resolve) => setTimeout(() => {
      state.acct.balance += amount
      log(`Top up · ${method}`, amount)
      resolve()
    }, 900))
  }

  function reportLost() { state.acct.status = 'blocked'; log('Card reported lost') }

  function newCard() {
    Object.assign(state.acct, { cardNo: rnd16(), physical: false, status: 'active' })
    log('New virtual card issued')
  }

  return { user, hasAccount, signUp, signIn, signOut, topUp, reportLost, newCard }
}
