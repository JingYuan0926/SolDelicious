export const idlFactory = ({ IDL }) => {
  const Store = IDL.Record({
    'name' : IDL.Text,
    'imageUrl' : IDL.Text,
    'rating' : IDL.Float64,
  });
  return IDL.Service({
    'createStore' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'deleteStore' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'getAllStores' : IDL.Func([], [IDL.Vec(Store)], ['query']),
    'getStore' : IDL.Func([IDL.Text], [IDL.Opt(Store)], ['query']),
    'updateStore' : IDL.Func([IDL.Text, IDL.Float64], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
