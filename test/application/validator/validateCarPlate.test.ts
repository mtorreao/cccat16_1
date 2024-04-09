import validateCarPlate from "../../../src/application/validator/validateCarPlate";

test("Deve retornar true se a placa for válida", function () {
    const plate = "ABC1234";
    expect(validateCarPlate(plate)).toBe(true);
});

test("Deve retornar false se a placa for válida", function () {
    const plate = "1234ABC";
    expect(validateCarPlate(plate)).toBe(false);
});