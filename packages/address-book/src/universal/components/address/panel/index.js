import React from 'react';
import PropTypes from 'prop-types';
import { useAppConfig } from '@oneaccount/react-foundations';
import { AddressPanelStyled, WrapTextLabel, WrapTextSubHeading } from './styled';

export default function AddressPanel({ address, isClubcard, additional }) {
  const { getLocalePhrase } = useAppConfig();

  if (!address || !address.addressLines || address.addressLines.length === 0) {
    return (
      <AddressPanelStyled>
        <WrapTextLabel>
          {getLocalePhrase(`pages.landing.missing-address.${isClubcard ? 'clubcard' : 'delivery'}`)}
        </WrapTextLabel>
      </AddressPanelStyled>
    );
  }

  const { label, addressLines, postTown, postCode, telephoneNumbers } = address;

  return (
    <AddressPanelStyled additional={!!additional}>
      {label && <WrapTextSubHeading>{label}</WrapTextSubHeading>}
      {addressLines.map(({ value }, idx) => (
        <WrapTextLabel key={`address-line-${idx.toString()}`}>{value}</WrapTextLabel>
      ))}
      {postTown && <WrapTextLabel>{postTown}</WrapTextLabel>}
      {postCode && <WrapTextLabel>{postCode}</WrapTextLabel>}
      {telephoneNumbers &&
        telephoneNumbers.map((tele, idx) => (
          <WrapTextLabel key={`telephone-number-${idx.toString()}`}>
            {`${getLocalePhrase(`pages.landing.telephone.${tele.label.toLocaleLowerCase()}`)}: ${
              tele.value
            }`}
          </WrapTextLabel>
        ))}
    </AddressPanelStyled>
  );
}

AddressPanel.propTypes = {
  address: PropTypes.object.isRequired,
  isClubcard: PropTypes.bool,
  additional: PropTypes.bool,
};
