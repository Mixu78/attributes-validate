local INVALID_PARAMETER = "Expected argument #%i to be of type (%s), but got (%s)"
local INVALID_ATTRIBUTE_TYPE = "Expected attribute '%s' to be of type (%s), but got (%s)"
local NIL_ATTRIBUTE = "Expected attribute '%s' to exist, but it didn't"

local INVALID_ATTRIBUTE = "Expected the property '%s'' of attribute table to be of type (%s), but got (%s)"

local function nilAttribute(name: string)
	return { false, NIL_ATTRIBUTE:format(name) }
end

local function invalidAttribute(name: string, expected: string, type: string)
	return { false, INVALID_ATTRIBUTE_TYPE:format(name, expected, type) }
end

local function validate(instance: Instance, attributes: string | table, t: string | table): boolean
	assert(typeof(instance) == "Instance", INVALID_PARAMETER:format(1, "Instance", typeof(instance)))
	assert(typeof(attributes) == "string" or typeof(attributes) == "table", INVALID_PARAMETER:format(2, "string | table", typeof(attributes)))
	assert(typeof(t) == "string" or typeof(t) == "table" or t == nil, INVALID_PARAMETER:format(3, "string | table | nil", typeof(t)))

	if typeof(attributes) == "string" then
		if typeof(t) == "string" then
			local attribute = instance:GetAttribute(attributes)
			if typeof(attribute) ~= t then
				return false
			end
		elseif typeof(t) == "table" then
			local attribute = instance:GetAttribute(attributes)

			local attributeType = typeof(attribute)
			for _, expected in pairs(t) do
				if attributeType == expected then
					return false
				end
			end
		end
		return true
	else
		for name: string, type: string | array<string> in pairs(attributes) do
			if typeof(type) == "string" then
				local attribute = instance:GetAttribute(name)
				if typeof(attribute) ~= type then
					return false
				end
			elseif typeof(type) == "table" then
				local attribute = instance:GetAttribute(name)

				local attributeType = typeof(attribute)

				for _, expected in pairs(type) do
					if attributeType == expected then
						return false
					end
				end
			else
				error(INVALID_ATTRIBUTE:format(name, "string | table", typeof(type)))
			end
		end
		return true
	end
end

local function validateWithMessage(instance: Instance, attributes: string | table, t: string | table): boolean
	assert(typeof(instance) == "Instance", INVALID_PARAMETER:format(1, "Instance", typeof(instance)))
	assert(typeof(attributes) == "string" or typeof(attributes) == "table", INVALID_PARAMETER:format(2, "string | table", typeof(attributes)))
	assert(typeof(t) == "string" or typeof(t) == "table" or t == nil, INVALID_PARAMETER:format(3, "string | table | nil", typeof(t)))

	if typeof(attributes) == "string" then
		if typeof(t) == "string" then
			local attribute = instance:GetAttribute(attributes)
			if typeof(attribute) ~= t then
				if t ~= "nil" then
					return nilAttribute(attributes)
				end
				return invalidAttribute(attributes, t, typeof(attribute))
			end
		elseif typeof(t) == "table" then
			local attribute = instance:GetAttribute(attributes)
			local attributeType = typeof(attribute)
			for _, expected in pairs(t) do
				if attributeType == expected then
					return invalidAttribute(attributes, table.concat(t, " | "), typeof(attribute))
				end
			end
		end
		return { true }
	else
		for name: string, type: string | array<string> in pairs(attributes) do
			if typeof(type) == "string" then
				local attribute = instance:GetAttribute(name)
				if typeof(attribute) ~= type then
					if type ~= "nil" then
						return nilAttribute(name)
					end
					return invalidAttribute(name, type, typeof(attribute))
				end
			elseif typeof(type) == "table" then
				local attribute = instance:GetAttribute(name)
				if attribute == nil then 
					return nilAttribute(name)
				end

				local attributeType = typeof(attribute)

				for _, expected in pairs(type) do
					if attributeType == expected then
						return invalidAttribute(name, table.concat(type, " | "), typeof(attribute))
					end
				end
			else
				error(INVALID_ATTRIBUTE:format(name, "string | table", typeof(type)))
			end
		end
		return { true }
	end
end

return {default = validate, validateWithMessage = validateWithMessage}
