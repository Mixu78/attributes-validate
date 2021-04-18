export type Validatable = {
	string: string;
	boolean: boolean;
	number: number;
	UDim: UDim;
	UDim2: UDim2;
	BrickColor: BrickColor;
	Color3: Color3;
	Vector2: Vector2;
	Vector3: Vector3;
	NumberSequence: NumberSequence;
	ColorSequence: ColorSequence;
	NumberRange: NumberRange;
	Rect: Rect;
};

export type AddAttribute<T, A, V> = {
	GetAttribute(this: T, attribute: A): V;
} & T;

export type AddAttributes<T, A extends Attributes> = MakeAttributeFunctions<AttributeFunctionsUnion<T, A>> & T;

export type SupportedTypes = keyof Validatable;

type Attributes = { readonly [key: string]: SupportedTypes | readonly SupportedTypes[] };

//eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (K: U) => void : never) extends (K: infer I) => void ? I : never;

//eslint-disable-next-line @typescript-eslint/no-explicit-any
type MakeAttributeFunctions<T extends (...args: any[]) => any> = {
	GetAttribute: UnionToIntersection<T>;
};

type ResolveAttributes<A extends SupportedTypes | readonly SupportedTypes[]> = A extends SupportedTypes
	? Validatable[A]
	: A extends readonly SupportedTypes[]
	? Validatable[A[number]]
	: never;

type AttributeFunctionsUnion<T, A extends Attributes> = {
	[K in keyof A]: (this: T, attribute: K) => ResolveAttributes<A[K]>;
}[keyof A];

/**
 * Checks if instance has an attribute named as expected and it's type matches expected type
 *
 * @param instance The instance to check attribute of
 * @param attribute The name of the attribute to check for
 * @param type The expected type of the attribute
 *
 * @returns A tuple of either [false, errorMessage] or [true]
 */
export function validateWithMessage<
	I extends Instance,
	A extends string,
	T extends SupportedTypes | readonly SupportedTypes[]
>(instance: I, attribute: A, type: T): [false, string] | [true];

/**
 * Checks if instance has all attributes named as expected and their types matches expected types
 *
 * @param instance The instance to check attributes of
 * @param attributes An object with `attributeName: attributeType` pairs
 *
 * @returns A tuple of either [false, errorMessage] or [true]
 */
export function validateWithMessage<I extends Instance, A extends Attributes>(
	instance: I,
	attributes: A,
): [false, string] | [true];

/**
 * Checks if instance has an attribute named as expected and it's type matches expected type
 *
 * @param instance The instance to check attribute of
 * @param attribute The name of the attribute to check for
 * @param type The expected type of the attribute
 *
 * @returns A boolean indicating if the attribute exists and is of expected type
 */
export default function validate<
	I extends Instance,
	A extends string,
	T extends SupportedTypes | readonly SupportedTypes[]
>(
	instance: I,
	attribute: A,
	type: T,
): instance is AddAttribute<
	I,
	A,
	T extends SupportedTypes ? Validatable[T] : T extends readonly SupportedTypes[] ? Validatable[T[number]] : never
>;

/**
 * Checks if instance has all attributes named as expected and their types matches expected types
 *
 * @param instance The instance to check attributes of
 * @param attributes An object with `attributeName: attributeType` pairs
 *
 * @returns A boolean indicating if all attributes exists and are of expected type
 */
export default function validate<I extends Instance, A extends Attributes>(
	instance: I,
	attributes: A,
): instance is AddAttributes<I, A>;
