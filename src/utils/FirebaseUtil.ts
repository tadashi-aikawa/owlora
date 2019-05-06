import {INITIAL_SHARED_STATE} from "../reducers"

export const config = (firebaseState: any): {[key: string]: any} => {
    if (!firebaseState.data || !firebaseState.data.config) {
        return {}
    }

    // Schema changed case (shared storage doesn't have...)
    const sharedState: {[key: string]: any} = {
        ...INITIAL_SHARED_STATE.config,
        ...firebaseState.data.config[firebaseState.auth.uid]
    }

    return sharedState
}

export const configPath = (firebaseState: any): string | undefined => firebaseState.auth.uid && `config/${firebaseState.auth.uid}`


