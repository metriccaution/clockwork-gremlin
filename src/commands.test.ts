import test from "ava";
import { stop, start } from "./commands";
import * as sinon from "sinon";

test("Passing a valid date to stop stops at that point", async t => {
  const date = new Date();

  const fetchIntervals = sinon.spy();
  const startNewInterval = sinon.spy();
  const updateCurrentInterval = sinon.spy();

  await stop(
    {
      fetchIntervals,
      startNewInterval,
      updateCurrentInterval
    },
    date.toISOString(),
    "Time"
  );

  t.false(fetchIntervals.called);
  t.false(startNewInterval.called);
  t.true(updateCurrentInterval.called);

  t.deepEqual(updateCurrentInterval.args, [[date, "Time"]]);
});

test("Passing an invalid date to stop throws up and doesn't call the DB", async t => {
  const fetchIntervals = sinon.spy();
  const startNewInterval = sinon.spy();
  const updateCurrentInterval = sinon.spy();

  try {
    await stop(
      {
        fetchIntervals,
        startNewInterval,
        updateCurrentInterval
      },
      "=^^=",
      "Time"
    );
    t.fail();
  } catch (e) {
    //
  }

  t.false(fetchIntervals.called);
  t.false(startNewInterval.called);
  t.false(updateCurrentInterval.called);
});

test("Passing a valid date to start starts at that point", async t => {
  const date = new Date();

  const fetchIntervals = sinon.spy();
  const startNewInterval = sinon.spy();
  const updateCurrentInterval = sinon.spy();

  await start(
    {
      fetchIntervals,
      startNewInterval,
      updateCurrentInterval
    },
    date.toISOString(),
    "Time"
  );

  t.false(fetchIntervals.called);
  t.true(startNewInterval.called);
  t.false(updateCurrentInterval.called);

  t.deepEqual(startNewInterval.args, [[date, "Time"]]);
});

test("Passing an invalid date to start throws up and doesn't call the DB", async t => {
  const fetchIntervals = sinon.spy();
  const startNewInterval = sinon.spy();
  const updateCurrentInterval = sinon.spy();

  try {
    await start(
      {
        fetchIntervals,
        startNewInterval,
        updateCurrentInterval
      },
      "=^^=",
      "Time"
    );
    t.fail();
  } catch (e) {
    //
  }

  t.false(fetchIntervals.called);
  t.false(startNewInterval.called);
  t.false(updateCurrentInterval.called);
});
