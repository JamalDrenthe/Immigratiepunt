import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(6, { message: "Please enter a valid phone number." }),
  countryOfOrigin: z.string().min(1, { message: "Please select your country of origin." }),
  bankingAssistance: z.boolean().default(false),
  housingSupport: z.boolean().default(false),
  employmentAssistance: z.boolean().default(false),
  administrativeSupport: z.boolean().default(false),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function SeekerForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      countryOfOrigin: "",
      bankingAssistance: false,
      housingSupport: false,
      employmentAssistance: false,
      administrativeSupport: false,
      privacyPolicy: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      const response = await apiRequest("POST", "/api/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        countryOfOrigin: data.countryOfOrigin,
        bankingAssistance: data.bankingAssistance,
        housingSupport: data.housingSupport,
        employmentAssistance: data.employmentAssistance,
        administrativeSupport: data.administrativeSupport,
      });

      if (response.ok) {
        toast({
          title: t('registration.successTitle'),
          description: t('registration.successMessage'),
          variant: "default",
        });
        form.reset();
      } else {
        const errorData = await response.json();
        toast({
          title: t('registration.errorTitle'),
          description: errorData.error || t('registration.errorMessage'),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('registration.errorTitle'),
        description: t('registration.errorMessage'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "h-10 rounded-lg border-[#e6dfd8] bg-[#faf9f5] focus-visible:ring-primary/30";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('registration.form.firstName')}</FormLabel>
                <FormControl>
                  <Input className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('registration.form.lastName')}</FormLabel>
                <FormControl>
                  <Input className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('registration.form.email')}</FormLabel>
              <FormControl>
                <Input type="email" className={inputClass} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('registration.form.phone')}</FormLabel>
              <FormControl>
                <Input type="tel" className={inputClass} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="countryOfOrigin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('registration.form.country')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder={t('registration.form.selectCountry')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel className="mb-3 block">{t('registration.form.servicesNeeded')}</FormLabel>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["bankingAssistance", 'services.banking.title'],
                ["housingSupport", 'services.housing.title'],
                ["employmentAssistance", 'services.employment.title'],
                ["administrativeSupport", 'services.administrative.title'],
              ] as const
            ).map(([name, labelKey]) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">{t(labelKey)}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="privacyPolicy"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel
                  className="font-normal"
                  dangerouslySetInnerHTML={{
                    __html: t('registration.form.privacyPolicy', {
                      interpolation: { escapeValue: false },
                    }),
                  }}
                />
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="h-11 w-full rounded-lg bg-primary text-sm font-medium text-white hover:bg-[#a9583e]"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('registration.form.submitting') : t('registration.form.register')}
        </Button>
      </form>
    </Form>
  );
}
