import * as winston from 'winston';
import {TransformableInfo} from 'logform';
import TransportStream = require('winston-transport');

// enumeration to assign color values to
enum LevelColors {
  DEBUG = 'seagreen',
  INFO = 'darkturquoise',
  WARN = 'khaki',
  ERROR = 'tomato',
}

// type levels used for setting color and shutting typescript up
type Levels = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const defaultColor = 'color: inherit';

//! Overriding winston Transporter transporter
class Transporter extends TransportStream {
  constructor(options = {}) {
    super(options);

    this.setMaxListeners(30);
  }

  log(info: TransformableInfo, next: () => void) {
    // styles a console log statement accordingly to the log level
    // log level colors are taken from levelcolors enum
    console.log(
      `%c[%c${info.level.toUpperCase()}%c]:`,
      defaultColor,
      `color: ${LevelColors[info.level.toUpperCase() as Levels]};`,
      defaultColor,
      // message will be included after stylings
      // through this objects and arrays will be expandable
      info.message
    );

    // must call the next function here
    // or otherwise you'll only be able to send one message
    next();
  }
}

// creating silent loggers with according levels
// silent by default to be automatically deactivated
// in production mode
export const logger = winston.createLogger({
  transports: [
    new Transporter({
      silent: true,
      level: 'debug',
    }),
  ],
});

// don't log anything in production mode
// probably should go further and return non
// working logger function to reduce
// execution time and improve speed results
// on application
if (process.env.NODE_ENV !== 'production') {
  logger.transports.forEach(transport => (transport.silent = false));
}
