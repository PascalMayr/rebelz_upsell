import React, { useState, Fragment } from 'react'
import { ResourcePicker } from '@shopify/app-bridge-react';
import { Button, Tag } from '@shopify/polaris';
import '../styles/components_resource_selection.css';

const CampaignResourceSelection = ({
    resourcePickerProps,
    buttonProps,
    resources = [],
    onResourceMutation
  }) => {
  const [open, setOpen] = useState(false);
  const { label } = buttonProps;
  return (
    <>
      <div className='salestorm-selected-resources'>
        {
          resources.map(resource => (
            <div className='salestorm-resource-tag' key={`${resourcePickerProps.resourceType}-${resource.id}`}>
              <Tag
                onRemove={() => {
                  onResourceMutation(resources.filter(findResource => findResource.id !== resource.id))
                }}
              >
                {resource.title}
              </Tag>
            </div>
          ))
        }
      </div>
      <>
        {
          NODE_ENV !== 'localdevelopment' &&
          <ResourcePicker
            {...resourcePickerProps}
            open={open}
            onCancel={() => setOpen(false)}
            onSelection={(selectPayload) => {
              setOpen(false);
              onResourceMutation(selectPayload.selection);
            }}
          />
        }
        <Button {...buttonProps} onClick={() => setOpen(true)}>{ label }</Button>
      </>
    </>
  )
}

export default CampaignResourceSelection