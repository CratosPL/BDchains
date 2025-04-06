import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface User {
  'principal' : Principal,
  'username' : [] | [string],
  'hasAccount' : boolean,
  'role' : string,
  'usernameChanges' : bigint,
  'avatarUrl' : [] | [string],
}
export interface _SERVICE {
  'getUser' : ActorMethod<[], [] | [User]>,
  'isRegistered' : ActorMethod<[], boolean>,
  'register' : ActorMethod<[string, [] | [string]], boolean>,
  'updateUser' : ActorMethod<[string, [] | [string]], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
