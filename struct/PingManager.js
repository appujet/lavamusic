const fetch = require('node-fetch');

module.exports = class PingManager{
  constructor(client, monitorPings = {}){

    /**
     * The client that instantiated this Manager
     * @name PingManager#client
     * @type {AlinaClient}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client })

    /**
     * Whether the manager is ready to give data
     * @type {boolean}
     */
    this.available = true;

    /**
     * Time when the ping were last updated
     * @type {date}
     */
    this.lastUpdatedAt = new Date();

    if (!Array.isArray(monitorPings.requests)){
      monitorPings.requests = [];
    };

    if (typeof monitorPings.timeout !== 'Number'){
      /**
       * The timeout between fetching ping
       * @type {boolean}
       */
      this.timeout = 300000;
    } else {
      if (monitorPings.timeout < 300000){
        this.timeout = 300000;
      } else {
        this.timeout = monitorPings.timeout;
      };
    };

    /**
     * The handlers for the ping the client manages
     * @type {boolean}
     */
    this.handlers = [
      {
        name: 'discord', registry: 'Client Heartbeat',
        description: 'DAPI (Discord Application Programming Interface) client ping that determines the delay between the incoming and outgoing of data within discord.',
        handler: undefined, options: undefined, type: 'getter'
      },{
        name: 'message', registry: 'Msg Roundtrip',
        description: 'DAPI (Discord Application Programming Interface) message latency displays the difference of time in milliseconds between receiving and sending of messages within discord',
        handler: undefined, options: undefined, type: undefined
      }
    ];

    for (const request of monitorPings.requests){
      if (typeof request.name !== 'string'){
        continue;
      };

      if (typeof request.url !== 'string' && !(request.function instanceof Promise)){
        continue;
      };

      const handler = request.url || request.function;
      const type = typeof request.url === 'string' ? 'request' : 'function';
      const options = typeof request.options === 'object' ? request.options : undefined;
      const registry = typeof request.registerAs === 'string' ? request.registerAs : request.name;
      const description = typeof request.description === 'string' ? request.description : null;

      this[request.name] = null;
      this.handlers.push({ name: request.name, registry, description, handler, options, type });
    };
  };

  _abort(fn, delay = 5000, ...param){
    return new Promise(async resolve => {
      setTimeout(() => resolve('ABORTED'), delay)

      const prop = await fn(...param);
      return resolve(prop)
    });
  }

  async _evaluate(options = {}){
    const now = Date.now();

    if (!Boolean(this.handlers.length - 2)){
      this.available = false;
      return Promise.resolve(this);
    };

    const evaluated = await Promise.all(
      this.handlers.map(x => {
        let response = {};

        if (x.type === 'request')
        {
          return this._abort(fetch, options.abortIn, x.handler, x.options )
          .then(evaluation => {
            if (evaluation === 'ABORTED'){
              response.error = 0;
            } else if (evaluation.status !== 200){
              response.error = evaluation.status;
            } else {
              response.success = Date.now() - now;
            };
            return response;
          });
        }
        else if (x.handler)
        {
          return this._abort(() => x.handler, options.abortIn)
          .then(evaluation => {
            if (evaluation === 'ABORTED'){
              response = { error: 0 };
            } else {
              return response = { success: Date.now() - now };
            };
            return response;
          });
        }
        else
        {
          return response;
        }
      })
    );

    this.lastUpdatedAt = new Date();

    this.handlers.forEach((x,i) => {
      if ([ 'discord', 'message' ].includes(x.name)){
        return;
      };

      this[x.name] = evaluated[i];
    });

    return Promise.resolve(this);
  };

  evaluate(options){
    if (options.force === true){
      return this._evaluate();
    } else {
      if (this.lastUpdatedAt.getTime() + this.timeout > Date.now()){
        if (this.handlers.some(x => this[x.name] === null)){
          return this._evaluate(options);
        };
        return Promise.resolve(this);
      } else {
        return this._evaluate(options);
      };
    };
  };

  get discord(){
    return this.client.ws.ping;
  };
};
