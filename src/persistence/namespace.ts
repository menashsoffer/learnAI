/** All persisted keys are namespaced so decks never collide and a schema bump is a prefix change. */
export const NS = 'learnai:v1';

export const deckKey = (deckId: string, key: string): string => `${NS}:${deckId}:${key}`;
export const globalKey = (key: string): string => `${NS}:${key}`;
