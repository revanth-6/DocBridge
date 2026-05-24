const healthSummaryService = require('../services/healthSummaryService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseUtils');

async function getDashboard(req, res) {
  try {
    const data = await healthSummaryService.getDashboard(req.user.userId);
    return successResponse(res, data, 'Dashboard data retrieved.');
  } catch (e) { return errorResponse(res, e.message, e.statusCode || 500); }
}

async function getTimeline(req, res) {
  try {
    const data = await healthSummaryService.getTimeline(req.user.userId, req.query);
    return paginatedResponse(res, data.events, data.total, data.page, data.limit, 'Timeline retrieved.');
  } catch (e) { return errorResponse(res, e.message, e.statusCode || 500); }
}

module.exports = { getDashboard, getTimeline };
