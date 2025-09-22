/**
 * Mock Kaspi adapter
 * real integration will require merchant credentials and docs
 */
async function createPayment({ amount, orderId, returnUrl }){
  // return a mock payment object
  return { success: true, provider: 'kaspi', amount, orderId, transactionId: 'KASPI-MOCK-' + Date.now(), redirectUrl: returnUrl || null };
}
async function checkStatus(transactionId){
  return { success: true, transactionId, status: 'paid' };
}
module.exports = { createPayment, checkStatus };
