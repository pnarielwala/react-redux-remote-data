// "Hack" fix for now, Object.entries and Object.values gets real ornery in flow otherwise
// https://github.com/facebook/flow/issues/2174#issuecomment-362156176
declare class Object {
  static entries<T>(object: { [string]: T }): Array<[string, T]>;
  static values<T>(object: { [string]: T }): Array<T>;
}
