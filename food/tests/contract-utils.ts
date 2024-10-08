import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  PreferencesUpdated,
  ReviewSubmitted
} from "../generated/Contract/Contract"

export function createPreferencesUpdatedEvent(
  user: Address,
  preferences: string
): PreferencesUpdated {
  let preferencesUpdatedEvent = changetype<PreferencesUpdated>(newMockEvent())

  preferencesUpdatedEvent.parameters = new Array()

  preferencesUpdatedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  preferencesUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "preferences",
      ethereum.Value.fromString(preferences)
    )
  )

  return preferencesUpdatedEvent
}

export function createReviewSubmittedEvent(
  user: Address,
  rating: i32,
  comment: string,
  confidenceScore: i32
): ReviewSubmitted {
  let reviewSubmittedEvent = changetype<ReviewSubmitted>(newMockEvent())

  reviewSubmittedEvent.parameters = new Array()

  reviewSubmittedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  reviewSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "rating",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(rating))
    )
  )
  reviewSubmittedEvent.parameters.push(
    new ethereum.EventParam("comment", ethereum.Value.fromString(comment))
  )
  reviewSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "confidenceScore",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(confidenceScore))
    )
  )

  return reviewSubmittedEvent
}
