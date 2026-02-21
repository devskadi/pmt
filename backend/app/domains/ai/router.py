# AI Router — /api/v1/ai
# -----------------------
# Endpoints:
#   POST /suggest/tasks          — AI-generated task suggestions for a project
#   POST /suggest/priorities     — AI-suggested priority adjustments
#   POST /summarize/sprint       — AI-generated sprint summary
#   POST /summarize/project      — AI-generated project health summary
#   GET  /usage                  — AI feature usage stats (admin)
#
# All AI endpoints are POST (they trigger processing) except usage.
# Response times may be longer — consider async/polling pattern.
#
# Placeholder — implementation pending.
