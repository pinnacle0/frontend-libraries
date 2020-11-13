import {StorageHelper} from "./StorageHelper";
import {MockStorage} from "./MockStorage";

export const SessionStorageUtil = new StorageHelper(typeof sessionStorage !== "undefined" ? sessionStorage : new MockStorage());
