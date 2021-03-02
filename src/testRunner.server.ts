import TestEZ from "@rbxts/testez";
import { ReplicatedStorage } from "@rbxts/services";

const results = TestEZ.TestBootstrap.run([ReplicatedStorage.tests]);

if (results.errors.size() > 0 || results.failureCount > 0) {
	error("Tests failed!");
}
