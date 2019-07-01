import React from 'react';
import PropTypes from 'prop-types';
import { useAppConfig } from '@oneaccount/react-foundations';
import { Signpost } from '@beans/typography';
import AddressPanel from '../panel';
import EditButton from '../buttons/edit';
import {
  AddressPanelStyled,
  AddressFooter,
  AddressHeader,
  HeaderIcon,
  FooterLabel,
  AddressHeaderText,
  Column,
} from './styled';

export default function PrimaryAddress({ isClubcard, details }) {
  const { getLocalePhrase } = useAppConfig();
  // TODO: Clubcard Icon
  const iconGraphic = <HeaderIcon graphic={isClubcard ? 'basket' : 'basket'} size="sm" />;

  const headerText = (
    <Signpost>
      {getLocalePhrase(
        `pages.landing.primary-address.header.${isClubcard ? 'clubcard' : 'grocery'}`,
      )}
    </Signpost>
  );

  const additionalText = getLocalePhrase(
    `pages.landing.primary-address.additional.${isClubcard ? 'clubcard' : 'grocery'}`,
  );

  const elementId = `edit-address${isClubcard ? '-clubcard' : '-grocery'}`;

  return (
    <Column size={24} sm={12}>
      <AddressPanelStyled id={elementId}>
        <AddressHeader className="primary-address__address-header">
          {iconGraphic}
          <AddressHeaderText>{headerText}</AddressHeaderText>
        </AddressHeader>
        <AddressPanel address={details} isClubcard={isClubcard} />
        <AddressFooter>
          {details.addressIndex && (
            <React.Fragment>
              <EditButton itemId={details.addressIndex} isMCA={isClubcard} />
              <FooterLabel>{additionalText}</FooterLabel>
            </React.Fragment>
          )}
        </AddressFooter>
      </AddressPanelStyled>
    </Column>
  );
}

PrimaryAddress.propTypes = {
  isClubcard: PropTypes.bool,
  details: PropTypes.object.isRequired,
};
