export const triggerBalanceUpdate = () => {
  window.dispatchEvent(new CustomEvent('balanceUpdate'))
}

export const triggerProfitUpdate = () => {
  window.dispatchEvent(new CustomEvent('profitUpdate'))
}
