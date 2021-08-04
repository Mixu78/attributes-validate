///<reference types="@rbxts/testez/globals"/>

import { t } from "@rbxts/t";

import validate, { SupportedTypes, validateWithMessage } from "..";

//very dumb way to type this
const TYPE_CREATORS: { [K in SupportedTypes]: () => t.static<t[K]> } = {
	nil: () => undefined,
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

		it("should support single union attributes", () => {
			const attribute = "foo";
			const attributes = [
				["string", "number"],
				["boolean", "Vector3"],
				["Rect", "NumberSequence"],
			] as const;

			for (const union of attributes) {
				for (const ttype of union) {
					instance.SetAttribute(attribute, TYPE_CREATORS[ttype]());
					expect(validate(instance, attribute, union)).to.be.ok();
				}
			}
		});

		it("should support union attribute types with multiple attributes", () => {
			const attributes = {
				foo: ["string", "number"],
				bar: "Vector3",
			} as const;

			for (const [attribute, value] of pairs(attributes)) {
				if (typeIs(value, "string")) {
					instance.SetAttribute(attribute, TYPE_CREATORS[value]());
				}
			}
			instance.SetAttribute("foo", TYPE_CREATORS["string"]());

			expect(validate(instance, attributes)).to.be.ok();
			instance.SetAttribute("foo", TYPE_CREATORS["number"]());
			expect(validate(instance, attributes)).to.be.ok();
		});

		it("should support nil type", () => {
			const attribute = "foo";
			const ttype = "nil";

			instance.SetAttribute(attribute, TYPE_CREATORS[ttype]());
			expect(validate(instance, attribute, ttype)).to.be.ok();
		});

		it("should support nil union types", () => {
			const attribute = "foo";
			const union = ["number", "nil"] as const;
			instance.SetAttribute(attribute, TYPE_CREATORS[union[0]]());
			expect(validate(instance, attribute, union)).to.be.ok();
			instance.SetAttribute(attribute, TYPE_CREATORS[union[1]]());
			expect(validate(instance, attribute, union)).to.be.ok();
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

		it("should support nil attributes", () => {
			const [ok] = validateWithMessage(instance, "a", "nil");
			expect(ok).to.be.ok();

			instance.SetAttribute("a", 0);
			const [ok2] = validateWithMessage(instance, "a", "nil");
			expect(ok2).to.be.equal(false);
		});
	});
};
