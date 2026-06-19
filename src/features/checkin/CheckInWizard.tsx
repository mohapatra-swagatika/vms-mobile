import React, {useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  Button,
  Icon,
  PhotoCapture,
  TextField,
  WizardDots,
} from '../../components';
import {locale} from '../../constants';
import {captureVisitorPhoto} from '../../services/photoService';
import {createVisitorFromCheckIn} from '../../services/visitorService';
import {colors, radius, spacing, typography} from '../../theme';
import {PURPOSE_OPTIONS} from './constants';
import {useCheckInWizard} from './useCheckInWizard';

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export function CheckInWizard({onClose, onSuccess}: Props) {
  const insets = useSafeAreaInsets();
  const wizard = useCheckInWizard();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const stepTitles = [
    locale.checkIn.steps.contact,
    locale.checkIn.steps.personal,
    locale.checkIn.steps.host,
    locale.checkIn.steps.photo,
    locale.checkIn.steps.summary,
  ];

  const handleNext = async () => {
    if (wizard.isLastStep) {
      await handleSubmit();
      return;
    }
    wizard.goNext();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createVisitorFromCheckIn(wizard.form);
      wizard.reset();
      onSuccess();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : locale.checkIn.submitFailed,
      );
      setSubmitting(false);
    }
  };

  const handleCapturePhoto = async () => {
    const uri = await captureVisitorPhoto();
    if (uri) {
      wizard.updateField('photoUri', uri);
    }
  };

  const renderStep = () => {
    switch (wizard.step) {
      case 'contact':
        return (
          <>
            <Text style={styles.stepTitle}>{locale.checkIn.contactTitle}</Text>
            <Text style={styles.stepCopy}>{locale.checkIn.contactSubtitle}</Text>
            <TextField
              variant="onPrimary"
              label={locale.addVisitor.phoneLabel}
              value={wizard.form.phone}
              onChangeText={value => wizard.updateField('phone', value)}
              placeholder={locale.addVisitor.phonePlaceholder}
              keyboardType="phone-pad"
              error={wizard.errors.phone}
            />
            <TextField
              variant="onPrimary"
              label={locale.addVisitor.emailLabel}
              value={wizard.form.email}
              onChangeText={value => wizard.updateField('email', value)}
              placeholder={locale.addVisitor.emailPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              error={wizard.errors.email}
            />
          </>
        );

      case 'personal':
        return (
          <>
            <Text style={styles.stepTitle}>{locale.checkIn.personalTitle}</Text>
            <Text style={styles.stepCopy}>{locale.checkIn.personalSubtitle}</Text>
            <TextField
              variant="onPrimary"
              label={locale.addVisitor.nameLabel}
              value={wizard.form.name}
              onChangeText={value => wizard.updateField('name', value)}
              placeholder={locale.addVisitor.namePlaceholder}
              error={wizard.errors.name}
            />
          </>
        );

      case 'host':
        return (
          <>
            <Text style={styles.stepTitle}>{locale.checkIn.hostTitle}</Text>
            <Text style={styles.stepCopy}>{locale.checkIn.hostSubtitle}</Text>
            <Text style={styles.chipLabel}>{locale.addVisitor.purposeLabel}</Text>
            <View style={styles.chips}>
              {PURPOSE_OPTIONS.map(option => (
                <Pressable
                  key={option}
                  onPress={() => wizard.updateField('purpose', option)}
                  style={[
                    styles.chip,
                    wizard.form.purpose === option && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      wizard.form.purpose === option && styles.chipTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
            {wizard.errors.purpose ? (
              <Text style={styles.inlineError}>{wizard.errors.purpose}</Text>
            ) : null}
            <TextField
              variant="onPrimary"
              label={locale.addVisitor.hostNameLabel}
              value={wizard.form.hostName}
              onChangeText={value => wizard.updateField('hostName', value)}
              placeholder={locale.addVisitor.hostNamePlaceholder}
              error={wizard.errors.hostName}
            />
            <TextField
              variant="onPrimary"
              label={locale.addVisitor.hostEmailLabel}
              value={wizard.form.hostEmail}
              onChangeText={value => wizard.updateField('hostEmail', value)}
              placeholder={locale.addVisitor.hostEmailPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              error={wizard.errors.hostEmail}
            />
            <TextField
              variant="onPrimary"
              label={locale.addVisitor.organizationLabel}
              value={wizard.form.organization}
              onChangeText={value => wizard.updateField('organization', value)}
              placeholder={locale.addVisitor.organizationPlaceholder}
            />
            <TextField
              variant="onPrimary"
              label={locale.addVisitor.departmentLabel}
              value={wizard.form.department}
              onChangeText={value => wizard.updateField('department', value)}
              placeholder={locale.addVisitor.departmentPlaceholder}
            />
          </>
        );

      case 'photo':
        return (
          <>
            <Text style={styles.stepTitle}>{locale.checkIn.photoTitle}</Text>
            <Text style={styles.stepCopy}>{locale.checkIn.photoSubtitle}</Text>
            <PhotoCapture
              photoUri={wizard.form.photoUri}
              error={wizard.errors.photo}
              onCapture={handleCapturePhoto}
              onRetake={handleCapturePhoto}
            />
          </>
        );

      case 'summary':
        return (
          <>
            <Text style={styles.stepTitle}>{locale.checkIn.summaryTitle}</Text>
            <Text style={styles.stepCopy}>{locale.checkIn.summarySubtitle}</Text>
            {wizard.form.photoUri ? (
              <View style={styles.summaryPhotoWrap}>
                <Image
                  source={{uri: wizard.form.photoUri}}
                  style={styles.summaryPhoto}
                  resizeMode="cover"
                />
              </View>
            ) : null}
            <SummaryRow label="Name" value={wizard.form.name} />
            <SummaryRow label="Phone" value={wizard.form.phone} />
            <SummaryRow label="Email" value={wizard.form.email} />
            <SummaryRow label="Purpose" value={wizard.form.purpose} />
            <SummaryRow label="Host" value={wizard.form.hostName} />
            <SummaryRow label="Host email" value={wizard.form.hostEmail} />
            <SummaryRow label="Organization" value={wizard.form.organization} />
            <SummaryRow label="Department" value={wizard.form.department} />
            {submitError ? (
              <Text style={styles.inlineError}>{submitError}</Text>
            ) : null}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable
          onPress={onClose}
          style={({pressed}) => [styles.closeBtn, pressed && {opacity: 0.85}]}
        >
          <Icon name="arrowLeft" size={20} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>{locale.checkIn.title}</Text>
          <Text style={styles.headerStep}>{stepTitles[wizard.stepIndex]}</Text>
        </View>
      </View>

      <WizardDots total={wizard.totalSteps} activeIndex={wizard.stepIndex} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom + 96},
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + spacing.sm}]}>
        <Button
          label={locale.checkIn.back}
          onPress={wizard.isFirstStep ? onClose : wizard.goBack}
          variant="ghost"
          style={styles.footerBtn}
          disabled={submitting}
        />
        <Button
          label={
            wizard.isLastStep ? locale.checkIn.complete : locale.checkIn.next
          }
          onPress={handleNext}
          variant="secondary"
          style={styles.footerBtn}
          loading={submitting}
          disabled={submitting}
        />
      </View>
    </View>
  );
}

function SummaryRow({label, value}: {label: string; value: string}) {
  if (!value?.trim()) {
    return null;
  }
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    ...typography.overline,
    color: 'rgba(255,255,255,0.88)',
  },
  headerStep: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 18,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  stepTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 22,
    marginBottom: 4,
  },
  stepCopy: {
    color: 'rgba(255,255,255,0.78)',
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  chipLabel: {
    color: 'rgba(255,255,255,0.88)',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  chipActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  chipText: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextActive: {
    color: colors.primary,
  },
  inlineError: {
    color: '#ffd0d0',
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  summaryPhotoWrap: {
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  summaryPhoto: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  summaryRow: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.18)',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.primaryDark,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  footerBtn: {
    flex: 1,
  },
});
