import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(6, { message: "Please enter a valid phone number." }),
  city: z.string().min(2, { message: "Please enter your city." }),
  monthlyDonation: z.boolean().default(false),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function HelperForm() {
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
      city: "",
      monthlyDonation: true,
      privacyPolicy: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      const response = await apiRequest("POST", "/api/helpers", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        monthlyDonation: data.monthlyDonation,
      });

      if (response.ok) {
        toast({
          title: t('helperForm.successTitle'),
          description: t('helperForm.successMessage'),
          variant: "default",
        });
        form.reset();
      } else {
        const errorData = await response.json();
        toast({
          title: t('helperForm.errorTitle'),
          description: errorData.error || t('helperForm.errorMessage'),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('helperForm.errorTitle'),
        description: t('helperForm.errorMessage'),
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

        <div className="grid gap-4 md:grid-cols-2">
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('helperForm.city')}</FormLabel>
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
          name="monthlyDonation"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-3 space-y-0 rounded-xl bg-[#efe9de] p-5">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="font-medium">{t('helperForm.donationTitle')}</FormLabel>
                <p className="text-xs leading-5 text-[#6c6a64]">{t('helperForm.donationText')}</p>
              </div>
            </FormItem>
          )}
        />

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
          {isSubmitting ? t('registration.form.submitting') : t('helperForm.submit')}
        </Button>
      </form>
    </Form>
  );
}
