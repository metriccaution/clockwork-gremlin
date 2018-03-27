# Clockwork Gremlin

A super-simple time tracking CLI. Installing and use is pretty rough and ready.

## Setting up

* Git clone the project
* `npm install`

## Running

### Recording new intervals

Time recording happens by creating / updating intervals, with a start and stop time.

The CLI allows for updating the most recent interval, or creating new intervals. When specifying an (optional time), the format is `hour:minute`, e.g. (`12:30`).

To create a new interval or update the start time of the most recent interval:

    node app start [time]

A new interval will be created if the most recent interval has a stop time, otherwise, the most recent interval will be updated.

### Finishing an interval

To finish an interval (or update the stop time of the most recent interval):

    node app stop [time]

### Viewing tracked time

Type `node app` to see a report of the most recent day's time.
