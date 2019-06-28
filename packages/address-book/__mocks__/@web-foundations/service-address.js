const original = jest.requireActual('@web-foundations/service-address');

export const on = jest.fn();
export const getAddress = jest.fn().mockResolvedValue();
export const createAddress = jest.fn().mockResolvedValue();
export const addresses = jest.fn().mockResolvedValue();

const MockAddressService = jest.fn(function AddressServiceMock() {
  Object.assign(this, {
    ...original.default,
    on,
    getAddress,
    createAddress,
    addresses,
  });
});

export const { AddressServiceError } = original;

export default MockAddressService;
