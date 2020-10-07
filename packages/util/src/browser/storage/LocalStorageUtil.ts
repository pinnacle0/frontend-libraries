import {StorageHelper} from "./StorageHelper";
import {MockStorage} from "./MockStorage";

export const LocalStorageUtil = new StorageHelper(typeof localStorage !== "undefined" ? localStorage : new MockStorage());
