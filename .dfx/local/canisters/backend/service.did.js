export const idlFactory = ({ IDL }) => {
  const User = IDL.Record({
    'principal' : IDL.Principal,
    'username' : IDL.Opt(IDL.Text),
    'hasAccount' : IDL.Bool,
    'role' : IDL.Text,
    'usernameChanges' : IDL.Nat,
    'avatarUrl' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'getUser' : IDL.Func([], [IDL.Opt(User)], ['query']),
    'isRegistered' : IDL.Func([], [IDL.Bool], ['query']),
    'register' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [IDL.Bool], []),
    'updateUser' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
