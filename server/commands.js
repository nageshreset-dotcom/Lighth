// Authoritative-ish command lists per Minecraft major versions (simplified)
export const COMMANDS = {
  '1.8': [
    'op <player>', 'deop <player>', 'whitelist add <player>', 'whitelist remove <player>',
    'gamemode <mode>', 'kick <player> [reason]', 'say <message>', 'time set <value>',
    'weather <clear|rain|thunder>', 'tp <target> <location>', 'give <player> <item> [count]'
  ],
  '1.12': [
    'op <player>', 'deop <player>', 'whitelist add <player>', 'whitelist remove <player>',
    'gamemode <mode>', 'kick <player> [reason]', 'say <message>', 'time set <value>',
    'weather <clear|rain|thunder>', 'tp <target> <location>', 'give <player> <item> [count]',
    'effect <player> <effect> [seconds] [amplifier]', 'enchant <player> <enchantment> [level]'
  ],
  'modern': [
    'op <player>', 'deop <player>', 'whitelist add <player>', 'whitelist remove <player>',
    'gamemode <mode>', 'kick <player> [reason]', 'say <message>', 'time set <value>',
    'weather <clear|rain|thunder>', 'tp <target> <location>', 'give <player> <item> [count]',
    'effect <player> <effect> [seconds] [amplifier]', 'enchant <player> <enchantment> [level]',
    'setblock <pos> <block>', 'setworldspawn [pos]', 'worldborder set <distance>', 'spawnpoint [player] [pos]'
  ]
};

export function getCommands(version) {
  if (!version) return COMMANDS.modern;
  if (version.startsWith('1.8')) return COMMANDS['1.8'];
  if (version.startsWith('1.12') || version.startsWith('1.13')) return COMMANDS['1.12'];
  return COMMANDS.modern;
}

export default { COMMANDS, getCommands };
