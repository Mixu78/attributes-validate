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

export type AddAttributes<T, A extends { [key: string]: keyof Validatable }> = {
	GetAttribute(this: T, attribute: keyof A): Validatable[A[keyof A]];
} & T;

export type SupportedTypes = keyof Validatable;

type Attributes = { [key: string]: SupportedTypes };

/**
 * Checks if instance has an attribute named as expected and it's type matches expected type
 *
 * @param instance The instance to check attribute of
 * @param attribute The name of the attribute to check for
 * @param type The expected type of the attribute
 *
 * @returns A tuple of either [false, errorMessage] or [true]
 */
export function validateWithMessage<I extends Instance, A extends string, T extends SupportedTypes>(
	instance: I,
	attribute: A,
	type: T,
): [false, string] | [true];

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
export default function validate<I extends Instance, A extends string, T extends SupportedTypes>(
	instance: I,
	attribute: A,
	type: T,
): instance is AddAttribute<I, A, Validatable[T]>;

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
	attribute: A,
): instance is AddAttributes<I, A>;
