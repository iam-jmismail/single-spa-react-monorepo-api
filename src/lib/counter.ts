import Counter from "@models/counters.model";

const getNextSequenceValue = async (name: string) => {
  const ret = await Counter.findAndModify({
    query: { _id: name },
    update: { $inc: { seq: 1 } },
    new: true,
  });
  return ret.seq;
};
