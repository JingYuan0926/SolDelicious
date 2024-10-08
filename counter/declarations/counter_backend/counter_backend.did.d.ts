import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Store {
  'name' : string,
  'imageUrl' : string,
  'rating' : number,
}
export interface _SERVICE {
  'createStore' : ActorMethod<[string, string], undefined>,
  'deleteStore' : ActorMethod<[string], boolean>,
  'getAllStores' : ActorMethod<[], Array<Store>>,
  'getStore' : ActorMethod<[string], [] | [Store]>,
  'updateStore' : ActorMethod<[string, number], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
