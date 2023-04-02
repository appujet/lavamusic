export interface BotPlugin {
  name: string;
  version: string;
  author: string;
  description?: string;
  initialize: (client: Lavamusic) => void;
  shutdown?: (client: Lavamusic) => void;
}

/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
