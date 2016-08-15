import DataBinder from './data_binding';

export default (state, binding) => {
  const DB = new DataBinder(state, binding);
  const dbState = DB.init();

  return {
    state: dbState,
    export: DB.export
  };
};
