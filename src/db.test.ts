import test, { Macro } from "ava";
import {
  compareTimes,
  TimeInterval,
  parseInterval,
  parseTimestampFile
} from "./db";

/*
 * Time interval sorting functions
 */
const sortIntervals: Macro = (
  t,
  input: TimeInterval[],
  expected: TimeInterval[]
) => {
  const actual = input.sort(compareTimes);
  t.deepEqual(actual, expected);
};

test(
  "Sorting an array of different items",
  sortIntervals,
  [
    {
      start: new Date(1),
      end: new Date(0)
    },
    {
      start: new Date(0),
      end: new Date(0)
    },
    {
      start: new Date(-1),
      end: new Date(0)
    },
    {
      start: new Date(0),
      end: new Date(1)
    }
  ],
  [
    {
      start: new Date(1),
      end: new Date(0)
    },
    {
      start: new Date(0),
      end: new Date(1)
    },
    {
      start: new Date(0),
      end: new Date(0)
    },
    {
      start: new Date(-1),
      end: new Date(0)
    }
  ]
);
test(
  "Sorting an array of the same items",
  sortIntervals,
  [
    {
      start: new Date(0),
      end: new Date(0)
    },
    {
      start: new Date(0),
      end: new Date(0)
    }
  ],
  [
    {
      start: new Date(0),
      end: new Date(0)
    },
    {
      start: new Date(0),
      end: new Date(0)
    }
  ]
);

/*
 * File parsing functions
 */
const parsingThrows: Macro = (t, data: any) => {
  t.throws(() => parseInterval(data));
};
parsingThrows.title = (provided: string) => `Invalid file parsing: ${provided}`;
// Bad entry contents
test("String", parsingThrows, "Hello world");
test("Null", parsingThrows, null);
test("Boolean", parsingThrows, true);
test("Empty object", parsingThrows, {});
test("Invalid start", parsingThrows, {
  start: new Date().toISOString() + ":)",
  end: new Date().toISOString()
});
test("Invalid end", parsingThrows, {
  start: new Date().toISOString(),
  end: new Date().toISOString() + ":)"
});
test("End is before start", parsingThrows, {
  start: new Date(1).toISOString(),
  end: new Date(0).toISOString()
});
test("No start", parsingThrows, {
  end: new Date(0).toISOString()
});
test("No end", parsingThrows, {
  start: new Date(0).toISOString()
});

test("Parses a valid entry", t => {
  const date = new Date();

  const expected = {
    start: date,
    end: date
  };

  const actual = parseInterval({
    start: date.toISOString(),
    end: date.toISOString()
  });

  t.deepEqual(expected, actual);
});

test("Parsing a timestamp file", t => {
  const expected = [
    {
      start: new Date(3),
      end: new Date(5)
    },
    {
      start: new Date(1),
      end: new Date(2)
    }
  ];

  const actual = parseTimestampFile([
    {
      start: new Date(1).toISOString(),
      end: new Date(2).toISOString()
    },
    {
      start: new Date(3).toISOString(),
      end: new Date(5).toISOString()
    }
  ]);

  t.deepEqual(expected, actual);
});

test("Parsing an empty file", t => {
  const actual = parseTimestampFile([]);
  t.deepEqual([], actual);
});

test("Parsing a timestamp file fails when not given an array", t => {
  t.throws(() => parseTimestampFile({}));
  t.throws(() => parseTimestampFile(null));
  t.throws(() => parseTimestampFile(true));
});

test("Parsing a timestamp file fails when given an invalid entry", t => {
  t.throws(() =>
    parseTimestampFile([
      {
        start: new Date(3).toISOString(),
        end: new Date(5).toISOString()
      },
      {
        start: "Blah",
        end: new Date(5).toISOString()
      },
      {
        start: new Date(1).toISOString(),
        end: new Date(2).toISOString()
      }
    ])
  );
});
