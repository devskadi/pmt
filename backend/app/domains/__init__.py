# Domains Package
# ---------------
# Domain-modular monolith. Each sub-package owns its
# router, service, repository, models, and schemas.
#
# Cross-domain communication MUST go through the event bus
# or shared service interfaces — never direct imports
# between domain internals.
