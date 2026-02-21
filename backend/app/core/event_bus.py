# Event Bus
# ---------
# In-process pub/sub event bus for domain events.
# Allows services to react to events from other domains
# without direct coupling.
#
# Interface:
#   publish(event: DomainEvent) -> None
#   subscribe(event_type, handler: Callable) -> None
#
# Current: synchronous in-process dispatch.
# Future: swap to Redis Streams, RabbitMQ, or Kafka
#         when extracting to microservices.
#
# Placeholder — implementation pending.
