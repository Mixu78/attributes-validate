///<reference types="@rbxts/testez/globals"/>

import { t } from "@rbxts/t";

import validate, { SupportedTypes, validateWithMessage } from "..";

//very dumb way to type this
const TYPE_CREATORS: { [K in SupportedTypes]: () => t.static<t[K]> } = {
	string: () => "",
	boolean: () => true,
	number: () => 0,
	UDim: () => new UDim(),
	UDim2: () => new UDim2(),
	BrickColor: () => new BrickColor(0),
	Color3: () => new Color3(),
	Vector2: () => new Vector2(),
	Vector3: () => new Vector3(),
	NumberSequence: () => new NumberSequence(0),
	ColorSequence: () => new ColorSequence(new Color3()),
	NumberRange: () => new NumberRange(0),
	Rect: () => new Rect(),
};

export = () => {
	let instance: Part;
	beforeEach(() => {
		if (instance) instance.Destroy();
		instance = new Instance("Part");
	});

	describe("non-message validation", () => {
		it("should support all roblox-supported attribute types", () => {
			for (const [type] of pairs(TYPE_CREATORS)) {
				instance.SetAttribute(type, TYPE_CREATORS[type]());
				expect(validate(instance, type, type)).to.be.equal(true);
			}
		});

		it("should support validating multiple attributes", () => {
			const attributes = {
				foo: "string",
				bar: "number",
				baz: "Color3",
			} as const;

			for (const [attribute, value] of pairs(attributes)) {
				instance.SetAttribute(attribute, TYPE_CREATORS[value]());
			}

			expect(validate(instance, attributes)).to.be.equal(true);
		});

		it("should validate that all attributes exist", () => {
			const attributes = {
				foo: "string",
				bar: "number",
				baz: "Color3",
			} as const;

			instance.SetAttribute("foo", TYPE_CREATORS[attributes["foo"]]());
			instance.SetAttribute("bar", TYPE_CREATORS[attributes["bar"]]());

			expect(validate(instance, attributes)).to.be.equal(false);
		});

		it("should truly validate types", () => {
			const attributes = {
				foo: "string",
				bar: "number",
				baz: "Color3",
			} as const;

			const wrongAttributes = {
				foo: "number",
				bar: "boolean",
				baz: "UDim2",
			} as const;

			for (const [attribute, value] of pairs(attributes)) {
				instance.SetAttribute(attribute, TYPE_CREATORS[value]());
			}

			expect(validate(instance, wrongAttributes)).to.be.equal(false);
		});
	});

	describe("with-message validation", () => {
		it("should return a message on validation failure", () => {
			const [ok, msg] = validateWithMessage(instance, "a", "number");

			expect(ok).to.be.equal(false);
			expect(msg).to.be.ok();
		});

		it("should return only true on validation success", () => {
			instance.SetAttribute("a", 0);

			const [ok, msg] = validateWithMessage(instance, "a", "number");

			expect(ok).to.be.ok();
			expect(msg).to.never.be.ok();
		});
	});
};
