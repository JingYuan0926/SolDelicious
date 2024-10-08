import {
  PreferencesUpdated as PreferencesUpdatedEvent,
  ReviewSubmitted as ReviewSubmittedEvent
} from "../generated/Contract/Contract"
import { PreferencesUpdated, ReviewSubmitted } from "../generated/schema"

export function handlePreferencesUpdated(event: PreferencesUpdatedEvent): void {
  let entity = new PreferencesUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.preferences = event.params.preferences

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReviewSubmitted(event: ReviewSubmittedEvent): void {
  let entity = new ReviewSubmitted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.rating = event.params.rating
  entity.comment = event.params.comment
  entity.confidenceScore = event.params.confidenceScore

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
