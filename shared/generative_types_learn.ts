export const PRODUCTS_PATTERN = {
  GET_ALL_PRODUCTS: 'get.products',
  CREATE_PRODUCT: 'create.products',
};

// Helper type to generate a numeric range from `0` to `Size - 1`
type GenerateRange<Size extends number, R extends unknown[] = []> = 
  R['length'] extends Size ? R : GenerateRange<Size, [...R, R['length']]>;

// Type for exact keys
type GetGatewayPatterns<
  T extends Record<string, string>,
  Size extends number
> = {
  [K in keyof T as `${string & K}_${GenerateRange<Size>[number]}`]: string;
};

// Function implementation  
export const getGateWayPatterns = <
  T extends Record<string, string>,
  Size extends number
>(
  pats: T,
  size: Size = 1
): GetGatewayPatterns<T, Size> => {
  const patterns: Partial<GetGatewayPatterns<T, Size>> = {};
  Object.entries(pats).forEach(([key, value]) => {
    for (let index = 0; index < size; index++) {
      patterns[`${key}_${index}` as keyof GetGatewayPatterns<T, Size>] = `${value}_${index}`;
    }
  });
  return patterns as GetGatewayPatterns<T, Size>;
};
const y = getGateWayPatterns(PRODUCTS_PATTERN, 1)
y.


// Generics
function wrapInArray<T>(value: T): T[] {
  return [value];
}

const wrapped = wrapInArray(42);

// Mapped Types: Generate Types Based on Input

type AddPrefix<T, Prefix extends string> = {
  [K in keyof T as `${Prefix}_${string & K}`]: T[K];
};

type Original = {
  id: number;
  name: string;
};

type Prefixed = AddPrefix<Original, "product">;

// 4. Template Literal Types  

type PrefixedKey<K extends string> = `prefix_${K}`;

type Example = PrefixedKey<"id" | "name">;
// Result: "prefix_id" | "prefix_name"

// Conditional Types: Branching Logic in Types
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false


// Recursion in Types: Dynamic Generation

type GenerateRange<Size extends number, R extends unknown[] = []> = 
  R['length'] extends Size ? R : GenerateRange<Size, [...R, R['length']]>;
