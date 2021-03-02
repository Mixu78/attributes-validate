local INVALID_PARAMETER = "Expected argument #%i to be of type (%s), but got (%s)"
local INVALID_ATTRIBUTE_TYPE = "Expected attribute '%s' to be of type (%s), but got (%s)"
local NIL_ATTRIBUTE = "Expected attribute '%s' to exist, but it didn't"

local function nilAttribute(name: string)
	return { false, NIL_ATTRIBUTE:format(name) }
end

local function invalidAttribute(name: string, expected: string, type: string)
	return { false, INVALID_ATTRIBUTE_TYPE:format(name, expected, type) }
end

local function validate(instance: Instance, attributes: string | table, t: string): boolean
	assert(typeof(instance) == "Instance", INVALID_PARAMETER:format(1, "Instance", typeof(instance)))
	assert(typeof(attributes) == "string" or typeof(attributes) == "table", INVALID_PARAMETER:format(2, "string | table", typeof(attributes)))
	assert(typeof(t) == "string" or t == nil, INVALID_PARAMETER:format(3, "string | nil", typeof(t)))

	if typeof(attributes) == "string" then
		local attribute = instance:GetAttribute(attributes)
		if attribute == nil then return false end
		if typeof(attribute) ~= t then
			return false
		end
		return true
	else
		for name: string, type: string in pairs(attributes) do
			local attribute = instance:GetAttribute(name)
			if attribute == nil then return false end
			if typeof(attribute) ~= type then
				return false
			end
		end
		return true
	end
end

local function validateWithMessage(instance: Instance, attributes: string | table, t: string): boolean
	assert(typeof(instance) == "Instance", INVALID_PARAMETER:format(1, "Instance", typeof(instance)))
	assert(typeof(attributes) == "string" or typeof(attributes) == "table", INVALID_PARAMETER:format(2, "string | table", typeof(attributes)))
	assert(typeof(t) == "string" or t == nil, INVALID_PARAMETER:format(3, "string | nil", typeof(t)))

	if typeof(attributes) == "string" then
		local attribute = instance:GetAttribute(attributes)
		if attribute == nil then return nilAttribute(attributes) end
		if typeof(attribute) ~= t then
			return invalidAttribute(attributes, t, typeof(attribute))
		end
		return { true }
	else
		for name: string, type: string in pairs(attributes) do
			local attribute = instance:GetAttribute(name)
			if attribute == nil then return nilAttribute(name) end
			if typeof(attribute) ~= type then
				return invalidAttribute(name, type, typeof(attribute))
			end
		end
		return { true }
	end
end

return {default = validate, validateWithMessage = validateWithMessage}