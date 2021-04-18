/*eslint-disable jsdoc/require-jsdoc */
interface ReplicatedStorage extends Instance {
	tests: Folder;
}

declare function beforeEach(callback: () => void): void;
