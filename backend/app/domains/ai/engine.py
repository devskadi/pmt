# AI Engine
# ---------
# Abstract LLM interface for provider-agnostic AI integration.
#
# Interface:
#   class LLMEngine(ABC):
#       async def complete(prompt: str, **kwargs) -> str
#       async def complete_structured(prompt: str, schema: Type[T]) -> T
#
# Implementations:
#   OpenAIEngine — GPT-4 / GPT-3.5 via openai SDK
#   AnthropicEngine — Claude via anthropic SDK (future)
#   MockEngine — Deterministic responses for testing
#
# Configuration via SETTINGS.AI_PROVIDER and SETTINGS.AI_API_KEY.
# Engine selection happens in dependency injection (core.dependencies).
#
# Placeholder — implementation pending.
