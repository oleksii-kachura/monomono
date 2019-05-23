import config from 'config';
import { logOutcome } from '../../logger';
import { AddressServiceError } from '@web-foundations/service-address';
import { ContactServiceError } from '@web-foundations/service-contact';
import controllerFactory from '../../controllers';
import { getPhraseFactory } from '../../utils/i18n';
import AJV from 'ajv';
import ajvErrors from 'ajv-errors';
import { convertAJVErrorsToFormik, sanitizeValues } from '@oneaccount/react-foundations';
import {
  handleAddressServiceError,
  handleContactServiceError,
  handleError,
  handleValidationErrors,
} from '../../utils/error-handlers';
import { handleResponse } from '../../utils/response-handlers';

const ajv = ajvErrors(
  new AJV({ allErrors: true, jsonPointers: true, $data: true, coerceTypes: true }),
  {
    allErrors: true,
  },
);

function getBreadcrumb(lang, getLocalePhrase) {
  return [
    {
      text: getLocalePhrase('pages.account.title'),
      href: `/${config.basePath}/${lang}/manage`,
    },
    {
      text: getLocalePhrase('pages.landing.title'),
      href: `/${config.basePath}/${config.appPath}/${lang}`,
      useAltLink: true,
    },
    {
      current: true,
      text: getLocalePhrase('pages.delivery-address.edit.title'),
    },
  ];
}

export async function getEditDeliveryAddressPage(req, res, next) {
  const getLocalePhrase = getPhraseFactory(req.lang);
  const { id } = req.query;
  const { fields, schema } = config[req.region].pages['delivery-address'];
  const { accessToken } = req.getClaims();
  const deliveryAddressController = controllerFactory('deliveryAddress.default', req.region);
  let address = {};
  const name = 'delivery-address:edit:get';
  const outcome = 'successful';

  if (!id) {
    return handleError({ name, error: new Error('CONTACT_ADDRESS_ID_REQUIRED'), req, res, next });
  }

  try {
    address = await deliveryAddressController.getAddress({
      accessToken,
      addressId: id,
      tracer: req.sessionId,
      context: req,
    });
  } catch (error) {
    if (error instanceof AddressServiceError) {
      return handleAddressServiceError({ error, name, req, res, next });
    } else if (error instanceof ContactServiceError) {
      return handleContactServiceError({ error, name, req, res, next });
    }

    return handleError({ name, error, req, res, next });
  }

  const payload = {
    breadcrumb: getBreadcrumb(req.lang, getLocalePhrase),
    banner: {},
    values: {
      ...address,
    },
    errors: {},
    fields,
    schema,
  };

  logOutcome(name, outcome, req);

  return handleResponse({
    res,
    data: {
      payload,
    },
    next,
  });
}

export async function postEditDeliveryAddressPage(req, res, next) {
  const getLocalePhrase = getPhraseFactory(req.lang);
  const { fields, schema } = config[req.region].pages['delivery-address'];
  const { id } = req.query;
  const { accessToken } = req.getClaims();
  const deliveryAddressController = controllerFactory('deliveryAddress.default', req.region);

  const data = req.body;
  const outcome = 'successful';
  const name = 'delivery-address:edit:post';

  // TODO: Cache schema
  const compiled = ajv.compile(schema);
  const isValid = compiled(sanitizeValues(data));

  const payload = {
    breadcrumb: getBreadcrumb(req.lang, getLocalePhrase),
    values: data,
    errors: {},
    banner: {},
    fields,
    schema,
  };

  if (!isValid) {
    const errors = convertAJVErrorsToFormik(compiled.errors, schema);

    return handleValidationErrors({
      name,
      errors,
      payload,
      req,
      res,
      next,
    });
  }

  try {
    await deliveryAddressController.updateAddress({
      accessToken,
      addressIndex: id,
      data,
      context: req,
      tracer: req.sessionId,
    });
  } catch (error) {
    if (error instanceof AddressServiceError) {
      return handleAddressServiceError({ name, payload, error, req, res, next });
    } else if (error instanceof ContactServiceError) {
      return handleContactServiceError({ name, payload, error, req, res, next });
    }

    return handleError(error);
  }

  logOutcome(name, outcome, req);

  return res.format({
    html: () => res.redirect(`/account/address-book/${req.locale.type}?action=updated`),
    json: () => {
      res.send({ payload });
    },
  });
}
