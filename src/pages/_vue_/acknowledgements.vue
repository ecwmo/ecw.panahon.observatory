<template>
  <div class="text-base md:text-xl p-4 m-0 md:px-16 md:my-8 md:mx-24 space-y-6">
    <p>
      In the spirit of over 155 years of service through science, we at the
      Manila Observatory are responding to the
      <span class="font-bold">climate emergency</span> through contributions to
      climate change mitigation and adaptation and disaster risk reduction.
    </p>
    <p>
      <span class="font-bold">On mitigation</span>, we are eager to share our
      science to advance the use of indigenous renewable power (i.e. mainly
      solar and wind) which remains largely untapped in our country. Beyond
      emissions reduction, utilizing indigenous renewable energy is critical to
      our country’s shift towards a green and blue economy.
    </p>
    <p>
      <span class="font-bold">On adaptation</span>, our forecasts for climate
      and climate-related risk over the long term (i.e. 2030s to 2090s) can be
      integrated into the sustainability, disaster risk reduction and resilience
      efforts of local communities and other vulnerable sectors in the country.
      Forecasts are vital inputs to decisions and actions on social protection
      and ecosystem management for food, water and energy security.
    </p>
    <p>
      <span class="font-bold">On risk reduction</span>, climate risk analysis is
      essential to investments in resilience against the cascading impacts of
      climate change. It is especially important for micro, small and medium
      enterprises that comprise over 99% of the economy. Large corporations can
      likewise embed climate risk into their core value cycles and strategic
      social responsibility programs to achieve their environment, social and
      governance goals.
    </p>
    <p>
      <span class="font-bold">We can not do all this alone</span> and we are
      truly grateful to our private sector partners who have been most generous
      in their support of this urgent mission to rewire our economy and protect
      our communities. May God return their magnanimity many times over.
    </p>
    <div>
      <template v-for="partner in partners" :key="partner.name">
        <div class="text-2xl font-bold">{{ `${partner.title}:` }}</div>
        <ul class="p-4 flex flex-wrap items-center gap-5">
          <li v-for="p in partner.list" :key="p.name" class="flex">
            <img
              v-if="p.logo"
              :src="p.logo"
              :alt="p.name"
              :class="p.logoClass"
            />
            <span v-else>{{ p.name }}</span>
          </li>
        </ul>
      </template>
    </div>
    <blockquote
      class="relative italic font-serif mx-4 md:mx-8 p-4 md:p-6 border text-gray-100 border-gray-500"
    >
      <span
        class="absolute text-6xl md:text-7xl opacity-30 top-0 left-0 mt-1 ml-0.5 md:mt-2 md:ml-1.5"
        aria-hidden="true"
        >&ldquo;</span
      >
      <p class="text-justify">
        We are not without hope. We have this decade to set things right. And we
        know we are not alone in heeding the call for all hands to be on deck,
        to batten down the hatches, so to speak, for the big storm that is about
        to define who we are for generations to come.
      </p>
    </blockquote>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  import smLogo from '@/assets/logos/SM_Prime.png'
  import acEnergyLogo from '@/assets/logos/AC_Energy.png'
  import alphalandLogo from '@/assets/logos/alphaland.png'
  import sanMiguelLogo from '@/assets/logos/san_miguel.png'
  import mvpLogo from '@/assets/logos/mvp.png'
  import lfugGOCLogo from '@/assets/logos/LFUG_GOC.png'
  import shellLogo from '@/assets/logos/shell.png'

  export default defineComponent({
    setup() {
      const partners = [
        {
          name: 'platinum',
          title: 'Platinum Partners',
          list: [
            {
              name: 'SM Group',
              logo: smLogo.src,
              logoClass: 'h-28 p-2.5 bg-white',
            },
            {
              name: 'Ayala Group',
              logo: acEnergyLogo.src,
              logoClass: 'h-24 bg-white',
            },
            {
              name: 'RVO Group',
              logo: alphalandLogo.src,
              logoClass: 'h-20 p-0.5 bg-white',
            },
            {
              name: 'RSA Group',
              logo: sanMiguelLogo.src,
              logoClass: 'h-20 p-0.5',
            },
            {
              name: 'MVP Group',
              logo: mvpLogo.src,
              logoClass: 'h-28 p-1.5 bg-white',
            },
          ],
        },
        {
          name: 'gold',
          title: 'Gold Partners',
          list: [
            {
              name: 'La Filipina Uy Gongco',
              logo: lfugGOCLogo.src,
              logoClass: 'h-24 bg-white p-1.5',
            },
            {
              name: 'Shell Philippines',
              logo: shellLogo.src,
              logoClass: 'h-24 bg-white p-3',
            },
          ],
        },
      ]

      return {
        partners,
      }
    },
  })
</script>
