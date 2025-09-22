/**
 * Mock Halyk adapter
 */
async function createPayment({ amount, orderId, returnUrl }){
  return { success: true, provider: 'halyk', amount, orderId, transactionId: 'HALYK-MOCK-' + Date.now(), redirectUrl: returnUrl || null };
}
async function checkStatus(transactionId){
  return { success: true, transactionId, status: 'paid' };
}
module.exports = { createPayment, checkStatus };
