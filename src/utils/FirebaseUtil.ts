export const config = (firebaseState: any): {[key: string]: any} => firebaseState.data && firebaseState.data.config ? firebaseState.data.config[firebaseState.auth.uid] : {}
export const configPath = (firebaseState: any): string | undefined => firebaseState.auth.uid && `config/${firebaseState.auth.uid}`
