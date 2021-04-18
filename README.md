# @rbxts/attributes-validate

[![NPM](https://nodei.co/npm/@rbxts/attributes-validate.png)](https://npmjs.org/package/@rbxts/attributes-validate)

Package for validating instance attributes.

## Installation
```npm i @rbxts/attributes-validate```

## Usage
For a validation function that returns true/false use the default export. For a validation function that returns a message on what was wrong with a validated attribute use validateWithMessage.

Both validate and validateWithMessage work the same:

```ts
//For a single attribute
validate(instance: Instance, attribute: string, type: SupportedType | SupportedType[]): boolean

//For multiple attributes
validate(instance: Instance, attributes: Record<string, SupportedType | SupportedType[]>): boolean

//validateWithMessage takes the same parameters and has the same overloads as above
validateWithMessage(...): [false, string] | [true]
```

where `SupportedType` is `"nil"` or one of the types listed on the [roblox developer hub](https://developer.roblox.com/en-us/articles/instance-attributes#supported-types) as a string, for example
`"UDim2"`, 
`"boolean"`, 
`"string"`.
## Example
```ts
import validate, { validateWithMessage } from "@rbxts/attributes-validate";

const instanceAttributes = {
	foo: "string",
	baz: "number"
	color: "Color3"
}

const instance = new Instance("Part");
instance.SetAttribute("foo", "bar");
instance.SetAttribute("baz", 0);
instance.SetAttribute("color", new Color3(0, 1, 0))

if (validate(instance, "foo", "string")) {
	//instance.GetAttribute("foo") is now of type string
}

if (validate(instance, instanceAttributes)) {
	//instance.GetAttribute("foo") is now of type string
	//instance.GetAttribute("baz") is now of type number
	//instance.GetAttribute("color") is now of type Color3
}

const unionType = ["string", "number", "nil"];
instance.SetAttribute("union", 10);
if (validate(instance, "union", unionType)) {
	//instance.GetAttribute("union") is now of type string | number | undefined
}

const [valid, msg] = validateWithMessage(instance, "baz", "UDim2");
//false, Expected attribute 'baz' to be of type (UDim2), but got (number)
print(valid, msg)
```