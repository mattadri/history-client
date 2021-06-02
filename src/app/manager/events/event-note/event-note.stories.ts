import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { action } from '@storybook/addon-actions';

import { EventNoteComponent } from './event-note.component';

export default {
  component: EventNoteComponent,
  decorators: [
    moduleMetadata({
      declarations: [EventNoteComponent],
      imports: [CommonModule],
    }),
  ],
  excludeStories: /.*Data$/,
  title: 'Event Note',
} as Meta;

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

const Template: Story<EventNoteComponent> = args => ({
  props: {
    ...args,
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});

