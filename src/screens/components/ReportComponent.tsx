import {Dialog, Portal, Text, Button, TextInput} from 'react-native-paper';
import React from 'react';
import {NotificationContext} from '../providers/NotificationProvider';

interface ReportComponentProps {
  visible: boolean;
  closeReportModal: () => void;
}

export default function ReportComponent({
  visible,
  closeReportModal,
}: ReportComponentProps): JSX.Element {
  const [feedbackText, setFeedbackText] = React.useState<string>('');
  const dispatchNotification = React.useContext(NotificationContext);

  const sendReport = React.useCallback(() => {
    // TODO: Send the report as mail
    closeReportModal();
    dispatchNotification && dispatchNotification('Thanks for feedback');
  }, []);
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={closeReportModal}>
        <Dialog.Title>Send Feedback </Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Enter feedback"
            multiline={true}
            value={feedbackText}
            mode="outlined"
            style={{height: 100}}
            onChangeText={event => setFeedbackText(event)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="text" compact={true} onPress={closeReportModal}>
            Close
          </Button>
          <Button
            disabled={!feedbackText.trim()}
            mode="text"
            compact={true}
            onPress={sendReport}>
            Send
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
