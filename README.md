# Clockwork Gremlin

A super-simple time tracking CLI. Installing and use is pretty rough and ready.

## Setting up

* Git clone the project
* `npm install`
* `npm run tsc`

## Running

### Recording new intervals

Time recording happens by creating / updating intervals, with a start and stop time.

The CLI allows for updating the most recent interval, or creating new intervals.

To create a new interval or update the start time of the most recent interval:

    node dist -c=start

### Finishing an interval

To finish an interval (or update the stop time of the most recent interval):

    node dist -c=start

### Viewing tracked time

Type `node dist` to see a report of the most recent day's time.
